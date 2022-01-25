import { APIGatewayProxyHandler } from 'aws-lambda';
import { UnitOfWork } from '../shared/repository/unitOfWork';
import { Utility } from '../shared/utility';
import { StatusCode } from '../shared/statusCode';

const uow = new UnitOfWork();

export const get: APIGatewayProxyHandler = async (event, _context) => {
  const userId = Utility.getUserId(event);
  const result = await uow.scenarios.get({id: event.pathParameters.id, userId})
  return StatusCode.Success200(result, event.headers.origin);
}
