import { AccessRequest, IAccessRequest } from "../models/AccessRequest";

class AccessRequestService {
  static async createAccessRequest(data: Partial<IAccessRequest>) {
    return await AccessRequest.create(data);
  }

  static async getAllAccessRequests() {
    return await AccessRequest.find();
  }
}

export default AccessRequestService;
