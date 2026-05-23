const validateSignUpData = (body) => {
    const { firstName, lastName, emailId } = body;

    if (!firstName) {
        throw new Error("Testing Error ")
    }

}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "password"]

    const isEditable = Object.keys(req.body).every((field => allowedEditFields.includes(field)))

    return isEditable;
}

module.exports = { validateSignUpData, validateEditProfileData }