import { z } from 'zod';

const BusinessNamesSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  name1: z.string().min(1, 'Name1 is required'),
  name2: z.string().optional(),
  name3: z.string().optional(),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  businessNature: z.string().min(1, 'Business nature is required'),
});

const DirectorSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    otherName: z.string().optional(),
    dateOfBirth: z.string().min(1, 'Date of birth is required').refine(
      (val) => !isNaN(Date.parse(val)),
      { message: 'Invalid date format for date of birth' }
    ),
    gender: z.enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: 'Gender must be male, female, or other' }),
    }),
    nationality: z.string().min(1, 'Nationality is required'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    occupation: z.string().min(1, 'Occupation is required'),
    address: z.string().min(1, 'Address is required'),
    nin: z.string().min(1, 'NIN is required'),
    identification: z.string().min(1, 'Identification is required'),
    passport: z.string().min(1, 'Passport is required'),
    signature: z.string().min(1, 'Signature is required'),
  });

  const WitnessSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    otherName: z.string().optional(),
    dateOfBirth: z.string().min(1, 'Date of birth is required').refine(
      (val) => !isNaN(Date.parse(val)),
      { message: 'Invalid date format for date of birth' }
    ),
    gender: z.enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: 'Gender must be male, female, or other' }),
    }),
    nationality: z.string().min(1, 'Nationality is required'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    occupation: z.string().min(1, 'Occupation is required'),
    address: z.string().min(1, 'Address is required'),
    witnessSignature: z.string().optional(),
  });

  export const RegistrationFormSchema = z.object({
    businessId: z.string().min(1, 'Business ID is required'),
    details: z.object({
      businessNames: BusinessNamesSchema,
      director: DirectorSchema,
      witness: WitnessSchema,
    }),
    txId: z.string().min(1, 'Transaction ID is required'),
    status: z.enum(['pending', 'approved', 'rejected'], {
      errorMap: () => ({ message: 'Status must be pending, approved, or rejected' }),
    }),
    document: z.string().min(1, 'Document is required'),
  });

 export const UpdateRegistrationDtoSchema = z.object({
    details: z
      .object({
        businessNames: BusinessNamesSchema.partial(),
        director: DirectorSchema.partial(),
        witness: WitnessSchema.partial(),
      })
      .optional(),
    status: z
      .enum(['pending', 'approved', 'rejected'], {
        errorMap: () => ({ message: 'Status must be pending, approved, or rejected' }),
      })
      .optional(),
    document: z.string().optional(),
  });