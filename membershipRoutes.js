const express = require('express')

const router = express.Router()

const {
    getMemberships,
    setMembership,
    updateMembership,
    deleteMembership
} = require('../controllers/membershipController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getMemberships).post(protect, setMembership)

router.route('/:id').put(protect, updateMembership).delete(protect, deleteMembership)

module.exports = router
