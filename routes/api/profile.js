import express from 'express';
const router = express.Router();

// @route GET api/profile/test
//@desc Tests posts route
//@access public route
router.get('/test', (req, res) => res.json({msg: "Profile Works"}));


export default router;
