const express = require("express");
const connectDb = require("./config/dbConnection");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const cloudinaryConfig = require("./config/cloudinaryConfig");
const dotenv = require("dotenv").config();
const stripeRoutes = require("./routes/stripe.routes");
const bodyParser = require("body-parser");

connectDb();
cloudinaryConfig();

const app = express();
const port = process.env.PORT || 5001;
app.use(cors());
app.use(fileUpload({ createParentPath: true }));
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/stripeController").webhook
);
app.use(express.json());

app.use("/api/surahs", require("./routes/surah.routes"));
app.use("/api/juzs", require("./routes/juz.routes"));
app.use("/api/ayahs", require("./routes/ayah.routes"));
app.use("/api/speakers", require("./routes/speaker.routes"));
app.use("/api/videos", require("./routes/video.routes"));
app.use("/api/videobychannel", require("./routes/videobychannel.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/greetings", require("./routes/greeting.routes"));
app.use("/api/hadeesbooks", require("./routes/hadeesbook.routes"));
app.use("/api/hadeesbookchapters", require("./routes/hadeesbookchapter.routes"));
app.use("/api/hadeesbychapters", require("./routes/hadeesbychapter.routes"));
app.use("/api/duas", require("./routes/dua.routes"));
app.use("/api/duasbyid", require("./routes/duabyid.routes"));
app.use("/api/allduaverse", require("./routes/allduaverse.routes"));
app.use("/api/duaverse", require("./routes/duaverse.routes"));
app.use("/api/duasversebyid", require("./routes/duaversebyid.routes"));
app.use("/api/videochannels", require("./routes/videochannel.routes"));
app.use("/api/tasbihs", require("./routes/tasbih.routes"));
app.use("/api/tasbihbyid", require("./routes/tasbihbyid.routes"));
app.use("/api/alltasbihverse", require("./routes/alltasbihverse.routes"));
app.use("/api/tasbihverse", require("./routes/tasbihverse.routes"));
app.use("/api/tasbihsversebyid", require("./routes/tasbihversebyid.routes"));
app.use("/api/ramadanvideos", require("./routes/ramadanvideo.routes"));
app.use("/api/ramadandata", require("./routes/ramadandata.routes"));
app.use("/api/ramadancalender", require("./routes/ramadancalender.routes"));
app.use("/api/ramadantime", require("./routes/ramadantime.routes"));
app.use("/api/wudhuvideos", require("./routes/wudhuvideo.routes"));
app.use("/api/homedua", require("./routes/homedua.routes"));
app.use("/api/reels", require("./routes/reel.routes"));
app.use("/api/reelsbyid", require("./routes/reelbyid.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/islamiccategories", require("./routes/islamiccategory.routes"));
app.use("/api/islamiccategoriesbyid", require("./routes/islamiccategorybyid.routes"));
app.use("/api/islsubcategories", require("./routes/islsubcategory.routes"));
app.use("/api/allislsubcategory", require("./routes/allislsubcategory.routes"));
app.use("/api/allislamicstory", require("./routes/allislamicstory.routes"));
app.use("/api/islamicstory", require("./routes/islamicstory.routes"));
app.use("/api/islamicstorybyid", require("./routes/islamicstorybyid.routes"));
app.use("/api/islamicstorybystoryid", require("./routes/islamicstorybystoryid.routes"));
app.use("/api/allislamicstoryaudios", require("./routes/allislamicstoryaudios.routes"));
app.use("/api/islamicstoryaudios", require("./routes/storiesaudios.routes"));
app.use("/api/islamicstoryaudiosbyid", require("./routes/storyaudiobyid.routes"));
app.use("/api/islamicstoryaudiosbystoryid", require("./routes/storyaudiobystoryid.routes"));
app.use("/api/stripe", stripeRoutes);

app.use("/uploads", express.static("uploads"));
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
