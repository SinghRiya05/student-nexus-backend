import app from "./app";
import env from "./core/env";
import connectDB from "./databases/database";

const startServer = async () => {
    await connectDB();

    app.listen(env.PORT, () => {
        console.log(`Server is running on port: ${env.PORT}`);
    });
};

startServer()