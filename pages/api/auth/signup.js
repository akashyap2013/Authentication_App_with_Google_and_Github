
import connectMongo from '../../../database/conn';
import Users from '../../../model/Schema'
import { hash } from 'bcryptjs';

export default async function handler(req, res){
    connectMongo().catch(error => res.json({ error: "Connection Failed...!"}))

    // only post method is accepted
    if(req.method === 'POST'){

        if(!req.body) return res.status(404).json({ error: "Don't have form data...!"});
        const { username, email, password } = req.body;

        // check duplicate users
        const checkexisting = await Users.findOne({ email });
        if(checkexisting) return res.status(422).json({ message: "User Already Exists...!"});

        // hash password
        Users.create({ username, email, password : await hash(password, 12)}, function(err, data){
            if(err) return res.status(404).json({ err });
            res.status(201).json({ status : true, user: data})
        })

    } else{
        res.status(500).json({ message: "HTTP method not valid only POST Accepted"})
    }

}