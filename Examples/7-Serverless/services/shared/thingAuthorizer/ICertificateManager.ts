import { Certificate } from "../../devices/models/certificate.model";

export interface ICertificateManager {
    createCertificate(): Promise<Certificate>;
    deleteCertificate(certId: string): Promise<boolean>
    attachThingToCert(thingName: string, certArn: string): Promise<boolean>;
}