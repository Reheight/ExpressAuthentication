const { Router } = require("express");
const pma = require("@prisma/client");
const regex = require("../../utilities/regex");
const checkAge = require("../../utilities/age");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateRefreshToken } = require("../../utilities/jtw");
const ProtectedRoute = require("../../middleware/ProtectedRoute");
const responseBuilder = require("../../utilities/responseBuilder");

const prisma = new pma.PrismaClient();

// Create User
router.post("/", async (req, res) => {
  const parameters = req.body;

  // Check basic security and design requirements

  if (!parameters.username)
    return responseBuilder(
      res,
      400,
      true,
      "You need to provide a username you want to use."
    );

  if (!parameters.emailAddress)
    return responseBuilder(
      res,
      400,
      true,
      "You need to provide an email address you want to use."
    );

  if (!parameters.displayName)
    return responseBuilder(
      res,
      400,
      true,
      "You need to provide a display name you want to use."
    );

  if (!parameters.password)
    return responseBuilder(
      res,
      400,
      true,
      "You need to provide a password you want to use."
    );

  if (!parameters.birthdate)
    return responseBuilder(
      res,
      400,
      true,
      "You need to provide your data of birth to register."
    );

  if (!parameters.displayName.match(regex.displayName))
    return responseBuilder(
      res,
      400,
      true,
      "You need to provide a display name that only uses numbers, letters, underscores, dashes, spaces, and periods and must be 3-16 characters in length."
    );

  if (!parameters.username.match(regex.username))
    return responseBuilder(
      res,
      400,
      true,
      "You need to provide a valid username that only uses numbers, letters, underscores, dashes, periods and must be 3-10 characters in length."
    );

  if (!parameters.emailAddress.match(regex.emailAddress))
    return responseBuilder(
      res,
      400,
      true,
      "You need to provide an email address you want to use."
    );

  if (!parameters.password.match(regex.password))
    return responseBuilder(
      res,
      400,
      true,
      "You need to provide a password that contains at least 8 characters, at least one letter and one number."
    );

  if (!checkAge(new Date(parameters.birthdate), 18))
    return responseBuilder(
      res,
      400,
      true,
      "You need to be 18 years or older to utilize this service."
    );

  // Check for existing records
  const usernameExists =
    (await prisma.member.count({ where: { username: parameters.username } })) >
    0;

  const emailExists =
    (await prisma.member.count({
      where: { emailAddress: parameters.emailAddress },
    })) > 0;

  if (usernameExists)
    return responseBuilder(
      res,
      400,
      true,
      "The username you provided is taken by another member."
    );

  if (emailExists)
    return responseBuilder(
      res,
      400,
      true,
      "The email you provided is taken by another member."
    );

  if (!parameters.tosAgree)
    return responseBuilder(
      res,
      400,
      true,
      "You must agree to our Terms of Service to register for this service."
    );

  if (!parameters.privacyAgree)
    return responseBuilder(
      res,
      400,
      true,
      "You must accept our Privacy Policy before you can register for this service."
    );

  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(parameters.password, salt);

  const accessToken = jwt.sign(
    {
      username: parameters.username,
      displayName: parameters.displayName,
      birthdate: parameters.birthdate,
      emailAddress: parameters.emailAddress,
      tosAgree: parameters.tosAgree,
      privacyAgree: parameters.privacyAgree,
    },
    passwordHash,
    { expiresIn: "7d" }
  );

  const newMember = await prisma.member
    .create({
      data: {
        username: parameters.username,
        password: passwordHash,
        displayName: parameters.displayName,
        birthdate: new Date(parameters.birthdate),
        emailAddress: parameters.emailAddress,
        tosAgree: parameters.tosAgree === "true",
        privacyAgree: parameters.privacyAgree === "true",
        sessions: {
          create: [
            {
              accessToken,
            },
          ],
        },
      },
    })
    .then((member) => member);

  if (newMember.error) return responseBuilder(res, 400, true, newMember.data);

  return responseBuilder(res, 200, false, accessToken);
});

// Retrieve User
router.get("/:id", ProtectedRoute, async (req, res) => {
  const member = await prisma.member.findFirst({
    where: { id: req.params.id },
  });

  if (!member)
    return responseBuilder(
      res,
      400,
      true,
      "There is no member that exists with the identifier provided."
    );

  if (member.id != req.member.id) {
    delete member.password;
    delete member.birthdate;
    delete member.tosAgree;
    delete member.privacyAgree;
  }

  return res.status(200).json(member).end();
});

// Delete User
router.delete("/:id", ProtectedRoute, async (req, res) => {
  const member = await prisma.member.findFirst({
    where: { id: req.params.id },
    include: {
      roles: true,
    },
  });

  if (!member)
    return res
      .status(400)
      .json({
        error: true,
        data: "There is no member that exists with that identifier.",
      })
      .end();

  if (req.member.id !== member.id)
    return res
      .status(403)
      .json({
        error: true,
        data: "You do not have permission to delete other member accounts.",
      })
      .end();

  return responseBuilder(
    res,
    200,
    false,
    "You have successfully deleted the account provided."
  );
});

// Update User
router.put("/", ProtectedRoute, async (req, res) => {});

module.exports = router;
