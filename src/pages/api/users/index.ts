import { NextApiRequest, NextApiResponse } from "next"
import pool from '../../../../db'
import { error } from "console";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
     
    if(req.method==="GET"){
        try {
            const result = await pool.query(`SELECT * FROM ${process.env.DB_EMP_TABLE} ORDER BY id ASC`);
            console.log("result", result);
            const users = result.rows
            res.status(200).json(users)
    
        } catch (error) {
            console.log("error",error)
            res.status(500).json({ error })
        }
    }
    else if(req.method==="POST"){
        try {
            const{lname,fname}=req.body;
            const newUser=await pool.query(`INSERT INTO ${process.env.DB_EMP_TABLE} (fname,lname) VALUES ($1,$2) RETURNING *`,[fname,lname]);
            res.status(201).json(newUser.rows[0])
            
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
    else{
        res.setHeader('Allow',['GET','POST'])
        res.status(405).json({error:`Method ${req.method} Not Allowed`})
    }


}

export default handler