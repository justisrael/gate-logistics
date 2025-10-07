import { model, Schema } from "mongoose";

interface BusinessNames {
  type: string;
  name1: string;
  name2?: string;
  name3?: string;
  phone: string;
  email: string;
  businessNature: string;
}

interface Director {
  firstName: string;
  lastName: string;
  otherName?: string;
  dateOfBirth: Date;
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
}

interface Witness {
  firstName: string;
  lastName: string;
  otherName?: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  nationality: string;
  phone: string;
  email: string;
  occupation: string;
  address: string;
  witnessSignature?: string;
}

export interface RegistrationForm {
  details: {
    businessNames: BusinessNames;
    director: Director;
    witness: Witness;
  };
  txId: string;
  status: "pending" | "approved" | "rejected";
  document: string;
}

const businessNamesSchema = new Schema<BusinessNames>({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  name1: {
    type: String,
    required: true,
    trim: true,
  },
  name2: {
    type: String,
    required: false,
    trim: true,
  },
  name3: {
    type: String,
    required: false,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
  },
  businessNature: {
    type: String,
    required: true,
    trim: true,
  },
});

const directorSchema = new Schema<Director>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  otherName: {
    type: String,
    required: false,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  nationality: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
    index: true,
  },
  occupation: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  nin: {
    type: String,
    required: true,
    trim: true,
  },
  identification: {
    type: String,
    required: true,
    trim: true,
  },
  passport: {
    type: String,
    required: true,
    trim: true,
  },
  signature: {
    type: String,
    required: true,
    trim: true,
  },
});

const witnessSchema = new Schema<Witness>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  otherName: {
    type: String,
    required: false,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  nationality: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
  },
  occupation: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  witnessSignature: {
    type: String,
    required: false,
    trim: true,
  },
});

const registrationFormSchema = new Schema<RegistrationForm>(
  {
    details: {
      businessNames: {
        type: businessNamesSchema,
        required: true,
      },
      director: {
        type: directorSchema,
        required: true,
      },
      witness: {
        type: witnessSchema,
        required: true,
      },
    },
    txId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
    },
    document: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const RegistrationFormModel = model<RegistrationForm>("RegistrationForm", registrationFormSchema);

export default RegistrationFormModel;