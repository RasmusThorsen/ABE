import { APIGatewayProxyHandler } from "aws-lambda";
import { Device, PostDeviceDto, PostDeviceResponseDto } from "./models/device.model";
import { v1 } from "uuid";
import { StatusCode } from "../shared/statusCode";
import { Utility } from "../shared/utility";
import { Validator } from "../shared/validator";
import { AwsBasicResource } from "./models/awsBasicResource.model";
import { Peripheral } from "./models/peripheral.model";
import { UnitOfWork } from "../shared/repository/unitOfWork";
import { ThingManager } from "../shared/thingManager/thingManager";
import { ThingAuthorizer } from "../shared/thingAuthorizer/thingAuthorizer";

const uow = new UnitOfWork();
const thingManager = new ThingManager();
const thingAuthoizer = new ThingAuthorizer();

export const createDevice: APIGatewayProxyHandler = async (event, _context) => {
  const postDevice: PostDeviceDto = JSON.parse(event.body);
  const userId = Utility.getUserId(event);
  if (postDevice.displayName == null || userId == null) {
    return StatusCode.Error400("Missing required properties: displayName");
  }

  let thingGroup: AwsBasicResource;
  const deviceId = v1();
  const thingName = `${deviceId}-${postDevice.displayName.replace(/ /g, "")}`
    .replace(/[Ææ]/g, "ae")
    .replace(/[øØ]/g, "o")
    .replace(/[Åå]/g, "aa");

  if (await Validator.firstDevice(userId)) {
    thingGroup = await thingManager.createThingGroup(userId);
    await thingAuthoizer.attachPolicyToArn("GodIoTPolicy", thingGroup.arn);

    const resp = await thingAuthoizer.attachPolicyToArn(
      "GodIoTPolicy",
      event.headers["identity-id"]
    );

    if (!resp) {
      return StatusCode.Error500(event.headers.origin);
    }
  } else {
    thingGroup = await thingManager.getThingGroup(userId);
  }

  const peripherals: Peripheral[] = postDevice.peripherals.map<Peripheral>(p => {
    return {
      ...p,
      values: new Map<string, Map<string, any>>()
    }
  })

  const device: Device = {
    id: deviceId,
    description: postDevice.description == "" ? " " : postDevice.description,
    userId,
    displayName: postDevice.displayName,
    thingName,
    manufactorer: postDevice.manufactorer,
    type: postDevice.type,
    peripherals,
  };

  const postedDevice = await uow.devices.add(device);

  if (!postedDevice) {
    return StatusCode.Error500(event.headers.origin);
  }

  const thing = await thingManager.createThing(thingName);

  if (!(await thingManager.addThingToGroup(thing, thingGroup))) {
    console.log("error: couldn't add thing to group");
    return StatusCode.Error500(event.headers.origin);
  }

  const cert = await thingAuthoizer.createCertificate();

  if (!(await thingAuthoizer.attachThingToCert(thing.name, cert.arn))) {
    console.log("Error attaching thing to certificate");
    return StatusCode.Error500(event.headers.origin);
  }

  await thingAuthoizer.attachPolicyToArn("GodIoTPolicy", cert.arn);

  const deviceReponse: PostDeviceResponseDto = {
    ...device,
    pem: cert.pem,
    privateKey: cert.privateKey
  }

  return StatusCode.Success201(
    deviceReponse,
    event.headers.origin
  );
};
