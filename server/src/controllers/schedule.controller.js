import { Schedule } from "../models/schedule.model.js";


// Create Schedule
export const createSchedule = async (req, res) => {
  try {

    const schedule = await Schedule.create(req.body);

    res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      data: schedule
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// Get All Schedules
export const getAllSchedules = async (req, res) => {
  try {

    const schedules = await Schedule
      .find()
      .populate("bus")
      .populate("route")
      .populate("driver");

    res.status(200).json({
      success: true,
      data: schedules
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// Get Single Schedule
export const getScheduleById = async (req, res) => {
  try {

    const schedule = await Schedule
      .findById(req.params.id)
      .populate("bus route driver");

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    res.status(200).json({
      success: true,
      data: schedule
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// Update Schedule
export const updateSchedule = async (req, res) => {
  try {

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Schedule updated successfully",
      data: schedule
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// Delete Schedule
export const deleteSchedule = async (req, res) => {
  try {

    const schedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Schedule deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};