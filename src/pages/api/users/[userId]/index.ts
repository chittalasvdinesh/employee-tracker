import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../../../db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("user???ID",req.query.user)
    const{userId}=req.query
    const { fname, lname, id } = req.body;
    try {
        if (req.method === "PUT") {
            const updatedUser = await pool.query(`UPDATE ${process.env.DB_EMP_TABLE} SET lname=$1,fname=$2 WHERE id=$3 RETURNING *`, [lname, fname, id]);
            res.status(200).json(updatedUser.rows[0])

        }
        else if (req.method === "DELETE") {
            await pool.query(`DELETE FROM ${process.env.DB_EMP_TABLE} WHERE id=$1 RETURNING *`, [userId]);
            console.log("id",(id))
            res.status(204).end();
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }

}

export default handler
