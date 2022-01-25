import { UnitOfWork } from "../shared/repository/unitOfWork";
import { ShadowState } from "./models/shadowState.model";

const uow = new UnitOfWork();

export const save = async (state: ShadowState) => {
  const result = await uow.devices.saveValues(state);

  if(!result) {
    console.log("Error saving values to db");
  }
};
