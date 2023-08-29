import mongoose from 'mongoose';

const dataPriceSchema = new mongoose.Schema(
  {
    dataID: { type: String },
    networkName: { type: String },
    customersPrice: { type: Number },
    resellersPrice: { type: Number },
    variationID: { type: String },
  },
  {
    timestamps: true,
  }
);

const dataPrice =
  mongoose.models.dataPrice || mongoose.model('dataPrice', dataPriceSchema);

export default dataPrice;
