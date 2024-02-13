const bcrypt = require('bcryptjs');
const User = require('../modules/module');

const getUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUser(req, res);
        if (user) {
            res.status(400).send('User already exists!');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email,
                password: hashedPassword
            });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        }
    } catch (error) {
        res.status(500).send('Error');
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUser(req, res);
        if (!user) {
            res.status(400).send('User not found!');
        } else {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }
            res.status(200).json({ message: 'Login successful' });
        }
    } catch (error) {
        res.status(500).json({ msg: "err occurred" });
    }
}

module.exports = {
    createUser,
    userLogin
}

module.exports = {
    createUser,
    userLogin
}


//  save for item search

// const getSingleItem = async(req,res)=>{
//     try {
//         let {id} = req.params
//         const task = await User.findOne({_id: id})
//         if(task === null) res.status(404).send('Couldn\'t find task with provided ID :('+id +')!')
//         res.status(201).json({task})
//     } catch (error) {
//         res.status(500).json({msg:error})
//     }
// }


// user info update.

// const updateUser = async (req, res) => {
//     try {
//         let {username} = req.body;
//         const result = await User.findOneAndUpdate({username}, req.body);
        
//         (result === null)
//             ? res.status(404).send('User not found')
//             : res.status(201).send('Updated successfully!');
//     } catch (error) {
//         res.status(500).json({ msg: error });
//     }
// };



        // delete items (save for later)
// const deleteTask = async(req,res)=>{
//     try {
//         let {id} = req.params;
//         const result = await User.findOneAndDelete({_id:id},req.body);

//         (result === null) 
//             ? res.status(404).send('User not found')
//             : res.status(201).send('deleted succesfully!')
//     } catch (error) {
//         res.status(500).json({msg:error})
//     }
// }

module.exports = {
    createUser,
    userLogin
    // getSingleTask,
    // updateTask,
    // deleteTask
}