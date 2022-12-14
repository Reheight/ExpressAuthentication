const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const responseBuilder = require("../../../utilities/responseBuilder");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ProtectedRoute = require("../../../middleware/ProtectedRoute");
const router = Router();

const prisma = new PrismaClient();

// Login route
router.post("/", async (req, res) => {
  if (!req.body.username)
    return responseBuilder(
      res,
      400,
      true,
      "You need to provide a username to access your account."
    );
  if (!req.body.password)
    return responseBuilder(
      res,
      400,
      true,
      "You need to provide a password to access your account."
    );

  const { username, password } = req.body;

  const userExists = (await prisma.member.count({ where: { username } })) > 0;

  if (!userExists)
    return responseBuilder(
      res,
      400,
      true,
      "We were unable to identify the account you're trying to access."
    );

  const member = await prisma.member.findFirst({ where: { username } });

  const passwordCorrect = bcrypt.compareSync(password, member.password);

  if (!passwordCorrect)
    return responseBuilder(
      res,
      403,
      true,
      "We are unable to provide you access to the account with the credentials you provided."
    );

  const accessToken = jwt.sign(
    {
      username: member.username,
      displayName: member.displayName,
      birthdate: member.birthdate,
      emailAddress: member.emailAddress,
      tosAgree: member.tosAgree,
      privacyAgree: member.privacyAgree,
    },
    member.password,
    { expiresIn: "7d" }
  );

  const newSession = await prisma.session.create({
    data: {
      accessToken,
      memberId: member.id,
    },
  });

  if (!newSession)
    return responseBuilder(
      res,
      500,
      true,
      "We ran into an issue when creating a new session for you."
    );

  return responseBuilder(res, 200, false, accessToken);
});

// Logout route
router.delete("/", ProtectedRoute, async (req, res) => {
  const logout = await prisma.session.delete({ where: { id: req.session.id } });

  if (!logout)
    return responseBuilder(
      res,
      500,
      true,
      "We ran into an unexpected issue when ending your current session."
    );

  return responseBuilder(
    res,
    200,
    false,
    "You have successfully terminated your session."
  );
});

module.exports = router;
