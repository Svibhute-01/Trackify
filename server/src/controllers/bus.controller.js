import { Bus } from "../models/bus.model.js";
export const addBus = async (req, res) => {
  try {
    const { numberPlate, capacity, status } = req.body;

    if (!numberPlate || !capacity) {
      return res.status(400).json({
        success: false,
        message: "Number Plate and Capacity are required",
      });
    }

    req.body.numberPlate = numberPlate.toUpperCase();

    const bus = await Bus.create(req.body);

    res.status(201).json({
      success: true,
      message: "Bus added Successfully",
      data: bus,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bus with this Number Plate already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllBuses=async(req,res)=>{
    try{
        const buses=await Bus.find();

        res.status(200).json({
            success:true,
            message:buses.length,
            data:buses,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};


export const getBusById=async(req,res)=>{
    try{
        const bus=await Bus.findById(req.params.id);
        if(!bus){
            return res.status(404).json({
                success:false,
                message:"Bus Not Found"
            })
        }
        res.status(200).json({
            success:true,
            
            data:bus,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};


export const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bus updated successfully",
      data: bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* Delete Bus */
export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bus deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};