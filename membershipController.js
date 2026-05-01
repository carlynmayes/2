const asyncHandler = require('express-async-handler')

const Membership = require('../model/membershipModel')

// http://localhost:5555/api/memberships/
const getMemberships = asyncHandler(async (req, res) => {

    const memberships = await Membership.find({})

    res.status(200).json(memberships)
})

// ===== CREATE A MEMBERSHIP =====
const setMembership = asyncHandler(async (req, res) => {

    // Validate that the request body contains all membership fields
    if (
        req.body.id === undefined ||
        !req.body.name ||
        req.body.price === undefined ||
        req.body.recurring === undefined ||
        req.body.discount === undefined ||
        req.body.active === undefined
    ) {
        res.status(400)
        throw new Error('Please add id, name, price, recurring, discount, and active fields.')
    }

    const membership_created = await Membership.create(
        {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            recurring: req.body.recurring,
            discount: req.body.discount,
            active: req.body.active
        }
    )

    res.status(200).json(membership_created)
})

// ===== UPDATE A MEMBERSHIP =====
const updateMembership = asyncHandler(async (req, res) => {

    const membership = await Membership.findById(req.params.id)

    if (!membership) {
        res.status(400)
        throw new Error('Membership not found')
    }

    const updatedMembership = await Membership.findByIdAndUpdate(
        req.params.id,
        {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            recurring: req.body.recurring,
            discount: req.body.discount,
            active: req.body.active
        },
        { new: true }
    )

    res.status(200).json(updatedMembership)
})

// ===== DELETE A MEMBERSHIP =====
const deleteMembership = asyncHandler(async (req, res) => {

    const membership = await Membership.findById(req.params.id)

    if (!membership) {
        res.status(400)
        throw new Error('Membership not found')
    }

    await membership.deleteOne()

    res.status(200).json({ message: `Delete membership ${req.params.id}` })
})

module.exports = {
    getMemberships,
    setMembership,
    updateMembership,
    deleteMembership
}
