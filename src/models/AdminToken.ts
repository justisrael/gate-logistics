import { model, Schema } from "mongoose";

interface AdminToken {
    id: number;
    token: string;
}

const adminTokenSchema = new Schema<AdminToken>({
    token: {
        type: String,
        required: true,
    },
}, {timestamps: true})

const adminTokenModel = model("AdminToken", adminTokenSchema);

export default adminTokenModel;