const { Router } = require("express");
const pma = require("@prisma/client");
const regex = require("../../utilities/regex");
const checkAge = require("../../utilities/age");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateRefreshToken } = require("../../utilities/jtw");
const ProtectedRoute = require("../../middleware/ProtectedRoute");

const prisma = new pma.PrismaClient();

// Create User
router.post("/", async (req, res) => {
  const parameters = req.body;

  // Check basic security and design requirements

  if (!parameters.username)
    return res
      .status(400)
      .json({
        error: true,
        data: "You need to provide a username to register.",
      })
      .end();

  if (!parameters.emailAddress)
    return res
      .status(400)
      .json({
        error: true,
        data: "You need to provide an email address to register.",
      })
      .end();

  if (!parameters.displayName)
    return res
      .status(400)
      .json({
        error: true,
        data: "You need to provide a display name to register.",
      })
      .end();

  if (!parameters.password)
    return res
      .status(400)
      .json({
        error: true,
        data: "You need to provide a password to register.",
      })
      .end();

  if (!parameters.birthdate)
    return res.status(400).json({
      error: true,
      data: "You need to provide a birthdate to register.",
    });

  if (!parameters.displayName.match(regex.displayName))
    return res
      .status(400)
      .json({
        error: true,
        data: "You need to provide a display name that only uses numbers, letters, underscores, dashes, spaces, and periods and must be 3-16 characters in length.",
      })
      .end();

  if (!parameters.username.match(regex.username))
    return res
      .status(400)
      .json({
        error: true,
        data: "You need to provide a valid username that only uses number, letters, underscores, dashes, periods and must be 3-10 characters in length.",
      })
      .end();

  if (!parameters.emailAddress.match(regex.emailAddress))
    return res
      .status(400)
      .json({
        error: true,
        data: "You need to provide a valid email address to register.",
      })
      .end();

  if (!parameters.password.match(regex.password))
    return res
      .status(400)
      .json({
        error: true,
        data: "You need to provide a password that contains at least 8 characters, at least one letter and one number.",
      })
      .end();

  if (!checkAge(new Date(parameters.birthdate), 18))
    return res
      .status(400)
      .json({
        error: true,
        data: "You need to be 18 years or older to utilize this service.",
      })
      .end();

  // Check for existing records
  const usernameExists =
    (await prisma.member.count({ where: { username: parameters.username } })) >
    0;

  const emailExists =
    (await prisma.member.count({
      where: { emailAddress: parameters.emailAddress },
    })) > 0;

  if (usernameExists)
    return res
      .status(400)
      .json({
        error: true,
        data: "The username you provided is already taken by another user.",
      })
      .end();

  if (emailExists)
    return res
      .status(400)
      .json({
        error: true,
        data: "The email you provided is already associated to an account.",
      })
      .end();

  if (!parameters.tosAgree)
    return res
      .status(400)
      .json({
        error: true,
        data: "You must agree to our Terms of Service to register for this service.",
      })
      .end();

  if (!parameters.privacyAgree)
    return res
      .status(400)
      .json({
        error: true,
        data: "You must accept and understand our Privacy Policy before registering.",
      })
      .end();

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

  if (newMember.error)
    return res
      .status(400)
      .json({
        error: true,
        data: newMember.data,
      })
      .end();

  return res.status(200).json({ error: false, data: { accessToken } }).end();
});

// Retrieve User
router.get("/:id", ProtectedRoute, async (req, res) => {
  const memberExists =
    (await prisma.member.count({ where: { id: req.params.id } })) > 0;

  if (!memberExists)
    return res
      .status(400)
      .json({
        error: true,
        data: "There is no member that exists with that identifier.",
      })
      .end();

  const member = await prisma.member.findFirst({
    where: { id: req.params.id },
  });

  if (!member)
    return res
      .status(400)
      .json({
        error: true,
        data: "There was an issue while retrieving information about the member provided.",
      })
      .end();

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
  const memberExists =
    (await prisma.member.count({ where: { id: req.params.id } })) > 0;

  if (!memberExists)
    return res
      .status(400)
      .json({
        error: true,
        data: "There is no member that exists with that identifier.",
      })
      .end();

  const member = await prisma.member.findFirst({
    where: { id: req.params.id },
    include: {
      roles: true,
    },
  });

  if (req.member.roles.length === 0 && req.member.id !== member.id)
    return res
      .status(403)
      .json({
        error: true,
        data: "You do not have permission to delete other member accounts.",
      })
      .end();

  return res.status(200).json(member).end();
});

// Update User
router.put("/", ProtectedRoute, async (req, res) => {});

module.exports = router;
