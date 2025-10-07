import RegistrationFormModel, { RegistrationForm } from "../models/FillingRecords";

interface CreateRegistrationDto {
    businessId: string;
    details: {
      businessNames: {
        type: string;
        name1: string;
        name2?: string;
        name3?: string;
        phone: string;
        email: string;
        businessNature: string;
      };
      director: {
        firstName: string;
        lastName: string;
        otherName?: string;
        dateOfBirth: string; // ISO date string
        gender: "male" | "female" | "other";
        nationality: string;
        phone: string;
        email: string;
        occupation: string;
        address: string;
        nin: string;
        identification: string;
        passport: string;
        signature: string;
      };
      witness: {
        firstName: string;
        lastName: string;
        otherName?: string;
        dateOfBirth: string; // ISO date string
        gender: "male" | "female" | "other";
        nationality: string;
        phone: string;
        email: string;
        occupation: string;
        address: string;
        witnessSignature?: string;
      };
    };
    txId: string;
    status?: "pending" | "approved" | "rejected";
    document: string;
  }
  
interface UpdateRegistrationDto {
    details?: {
      businessNames?: Partial<RegistrationForm["details"]["businessNames"]>;
      director?: Partial<RegistrationForm["details"]["director"]>;
      witness?: Partial<RegistrationForm["details"]["witness"]>;
    };
    status?: "pending" | "approved" | "rejected";
    document?: string;
  }
class FillingRecordsService{

    static async create(dto: CreateRegistrationDto): Promise<RegistrationForm> {
        try {
          // Validate required fields
          if (!dto.businessId || !dto.details || !dto.txId || !dto.document) {
            throw new Error("Business ID, details, transaction ID, and document are required");
          }
    
          // Check for duplicate txId
          const existingForm = await RegistrationFormModel.findOne({ txId: dto.txId });
          if (existingForm) {
            throw new Error("Registration form with this transaction ID already exists");
          }
    
          // Create new registration form
          const form = await RegistrationFormModel.create({
            businessId: dto.businessId,
            details: {
              businessNames: dto.details.businessNames,
              director: {
                ...dto.details.director,
                dateOfBirth: new Date(dto.details.director.dateOfBirth),
              },
              witness: {
                ...dto.details.witness,
                dateOfBirth: new Date(dto.details.witness.dateOfBirth),
              },
            },
            txId: dto.txId,
            status: dto.status || "pending",
            document: dto.document,
          });
    
          return form;
        } catch (error: any) {
          throw new Error(error.message || "Error creating registration form");
        }
      }

    static async fetchByBusinessId(businessId: string): Promise<RegistrationForm[]> {
        try {
          const forms = await RegistrationFormModel.find({ businessId }).lean();
          if (!forms.length) {
            throw new Error("No registration forms found for this business");
          }
          return forms;
        } catch (error: any) {
          throw new Error(error.message || "Error fetching registration forms");
        }
      }
    
      static async fetchAll(): Promise<RegistrationForm[]> {
        try {
          const forms = await RegistrationFormModel.find().lean();
          if (!forms.length) {
            throw new Error("No registration forms found");
          }
          return forms;
        } catch (error: any) {
          throw new Error(error.message || "Error fetching registration forms");
        }
      }
    
      static async updateOne(id: string, dto: UpdateRegistrationDto): Promise<RegistrationForm> {
        try {
          const form = await RegistrationFormModel.findById(id);
          if (!form) {
            throw new Error("Registration form not found");
          }
    
          // Update fields
          if (dto.details?.businessNames) {
            form.details.businessNames = { ...form.details.businessNames, ...dto.details.businessNames };
          }
          if (dto.details?.director) {
            form.details.director = { ...form.details.director, ...dto.details.director };
          }
          if (dto.details?.witness) {
            form.details.witness = { ...form.details.witness, ...dto.details.witness };
          }
          if (dto.status) {
            form.status = dto.status;
          }
          if (dto.document) {
            form.document = dto.document;
          }
    
          const updatedForm = await form.save();
          return updatedForm;
        } catch (error: any) {
          throw new Error(error.message || "Error updating registration form");
        }
      }
}

export default FillingRecordsService;