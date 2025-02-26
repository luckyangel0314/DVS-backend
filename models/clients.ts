import mongoose from "mongoose";

const Schema = mongoose.Schema;
const clientSchema = new Schema({
    accountId: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    birthday: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    languages: {
        type: String,
        required: false,
    },
    profileCompleteness: {
        type: String,
        required: false,
    },
    socialMedia: {
        type: String,
        required: false,
    },
    //   organization: {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //   },
    organization: [
        {
            organizationName: {
                type: String,
                required: false
            },
            specialists: {
                type: Array,
                required: false
            },
            dayOfRegistraton: {
                type: String,
                required: false
            },
            description: {
                type: String,
                required: false
            },
            revenue: {
                type: String,
                required: false
            },
            headquarter: {
                type: String,
                required: false
            },
            industry: {
                type: String,
                required: false
            },
            teamSize: {
                type: String,
                required: false
            },
            fundingStage: {
                type: String,
                required: false
            },
            logo: {
                type: String,
                required: false
            },
            website: {
                type: String,
                required: false
            },
            socialLink: {
                type: String,
                required: false
            },
        },
    ],

    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    lastLoggedIn: {
        type: Date,
        default: Date.now(),
    },
});

const Client = mongoose.model("client", clientSchema);
export default Client;
