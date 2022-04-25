const Agency = require('../models/agency.model');
const CreateError = require('http-errors');
const agencyValidation = require('../validations/agency.validation');

const createAgency = async (req, res, next) => {
  try {
    const { label } = req.body;

    const foundAgency = await Agency.findOne({ label });

    if (foundAgency) {
      throw CreateError.Conflict(`Agency with value "${label}" already exists`);
    }

    const value = label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
      .replace(/\s/g, '-');
    const newAgency = new Agency({ label, value });

    const savedAgency = await newAgency.save();

    return res.status(201).json(savedAgency);
  } catch (error) {
    next(error);
  }
};

const updateAgency = async (req, res, next) => {
  try {
    const { label } = req.body;
    const { agencyId } = req.params;

    const foundAgency = await Agency.findById(agencyId);
    if (!foundAgency) {
      throw CreateError.NotFound(`Agency with id "${agencyId}" not found`);
    }

    const foundAgencyWithSameLabel = await Agency.findOne({ label });

    if (foundAgencyWithSameLabel && foundAgencyWithSameLabel.id !== agencyId) {
      throw CreateError.Conflict(`Agency with value "${label}" already exists`);
    }

    const value = label;
    const updatedAgency = await Agency.findByIdAndUpdate(
      agencyId,
      { label, value },
      { new: true }
    );

    return res.status(200).json(updatedAgency);
  } catch (error) {
    next(error);
  }
};

const deleteAgency = async (req, res, next) => {
  try {
    const { agencyId } = req.params;
    await Agency.findByIdAndDelete(agencyId);
    // Delete all references to this agency in the database
    return res.status(200).json({
      message: 'Agency deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getAllAgencies = async (req, res, next) => {
  try {
    const foundAgencies = await Agency.find({});
    return res.status(200).json(foundAgencies);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAgency,
  updateAgency,
  deleteAgency,
  getAllAgencies,
};