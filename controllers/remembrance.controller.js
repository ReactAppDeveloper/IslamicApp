const Remembrance = require("../models/remembrance");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "wasil/remembrance",
          resource_type: "image",
        },

        (error, result) => {

          if (error) {
            reject(error);
          } else {
            resolve(result);
          }

        }
      );

    streamifier
      .createReadStream(buffer)
      .pipe(uploadStream);
  });
};

const createRemembrance = async (req, res) => {

  try {

    const {
      fullName,
      email,
      phone,
      relationship,
      lovedOneName,
      gender,
      shortdescription,
      description,
    } = req.body;


    // ======================================
    // VALIDATION
    // ======================================

    if (!fullName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }


    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }


    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }


    if (!relationship?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Relationship is required.",
      });
    }


    if (!lovedOneName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Loved one's name is required.",
      });
    }


    if (!gender?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Gender is required.",
      });
    }


    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }


    if (description.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message:
          "Description cannot exceed 200 characters.",
      });
    }


    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo is required.",
      });
    }

    const cloudinaryResult =
      await uploadToCloudinary(
        req.file.buffer
      );

    const remembrance =
      await Remembrance.create({

        fullName: fullName.trim(),

        email: email.trim().toLowerCase(),

        phone: phone.trim(),

        relationship:
          relationship.trim(),

        lovedOneName:
          lovedOneName.trim(),

        gender:
          gender.trim(),

       shortdescription:
        shortdescription?.trim() || "",

        description:
          description.trim(),

        photo: {
          url: cloudinaryResult.secure_url,

          publicId:
            cloudinaryResult.public_id,
        },

        status: "pending",
      });


    // ======================================
    // RESPONSE
    // ======================================

    return res.status(201).json({

      success: true,

      message:
        "Your remembrance has been submitted successfully.",

      data: remembrance,
    });


  } catch (error) {

    console.error(
      "Create remembrance error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to submit remembrance.",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

const getApprovedRemembrances = async (
  req,
  res
) => {

  try {

    const remembrances =
      await Remembrance.find({
        status: "approved",
      })
        .sort({
          createdAt: -1,
        })
        .lean();


    return res.status(200).json({

      success: true,

      count: remembrances.length,

      data: remembrances,
    });


  } catch (error) {

    console.error(
      "Get approved remembrances error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to fetch remembrances.",
    });
  }
};

const getAllRemembrances = async (
  req,
  res
) => {

  try {

    const remembrances =
      await Remembrance.find()
        .sort({
          createdAt: -1,
        })
        .lean();


    return res.status(200).json({

      success: true,

      count: remembrances.length,

      data: remembrances,
    });


  } catch (error) {

    console.error(
      "Get all remembrances error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to fetch remembrances.",
    });
  }
};

const updateRemembranceStatus = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const { status } = req.body;


    if (
      ![
        "pending",
        "approved",
        "rejected",
      ].includes(status)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid remembrance status.",
      });
    }


    const remembrance =
      await Remembrance.findByIdAndUpdate(

        id,

        {
          status,
        },

        {
          new: true,
          runValidators: true,
        }
      );


    if (!remembrance) {

      return res.status(404).json({

        success: false,

        message:
          "Remembrance not found.",
      });
    }


    return res.status(200).json({

      success: true,

      message:
        `Remembrance ${status} successfully.`,

      data: remembrance,
    });


  } catch (error) {

    console.error(
      "Update remembrance status error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to update remembrance status.",
    });
  }
};

const getRemembranceById = async (req, res) => {
  try {
    const { id } = req.params;

    const remembrance = await Remembrance.findOne({
      _id: id,
      status: "approved",
    }).lean();

    if (!remembrance) {
      return res.status(404).json({
        success: false,
        message: "Remembrance not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: remembrance,
    });
  } catch (error) {
    console.error(
      "Get remembrance by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch remembrance.",
    });
  }
};

module.exports = {
  createRemembrance,
  getApprovedRemembrances,
  getAllRemembrances,
  getRemembranceById,
  updateRemembranceStatus,
};