import mongoose from "mongoose";

/**
 * first check connection already exist or not. if not exist then connection will be made.
 * 
 */

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    // first or saftey check
    if(connection.isConnected){
        console.log("already connected to the database");
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        // console.log("db:",db)
        connection.isConnected =  db.connections[0].readyState

        console.log("db connection successfully");
    } catch (error) {
        
        console.log("database connection is failed");
        process.exit(1)
    }
}

export default dbConnect