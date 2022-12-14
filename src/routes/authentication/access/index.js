const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ProtectedRoute = require("../../../middleware/ProtectedRoute");
const router = Router();

const prisma = new PrismaClient();

// Login route
router.post("/", async (req, res) => {
  if (!req.body.username)
    return res
      .status(400)
      .json({
        error: true,
        data: "You need to provide a username to access your account.",
      })
      .end();
  if (!req.body.password)
    return res
      .status(400)
      .json({
        error: true,
        data: "You need to provide a password to access your account.",
      })
      .end();

  const { username, password } = req.body;

  const userExists = (await prisma.member.count({ where: { username } })) > 0;

  if (!userExists)
    return res
      .status(400)
      .json({
        error: true,
        data: "We were unable to identify the account you're trying to access.",
      })
      .end();

  const member = await prisma.member.findFirst({ where: { username } });

  const passwordCorrect = bcrypt.compareSync(password, member.password);

  if (!passwordCorrect)
    return res
      .status(200)
      .json({
        error: true,
        data: "We are unable to provide you access to the account with the credentials provided.",
      })
      .end();

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
    return res
      .status(500)
      .json({
        error: true,
        data: "We ran into an issue when creating a new session for you.",
      })
      .end();

  return res.status(200).json({ error: false, data: { accessToken } }).end();
});

// Logout route
router.delete("/", ProtectedRoute, async (req, res) => {
  const logout = await prisma.session.delete({ where: { id: req.session.id } });

  if (!logout)
    return res
      .status(500)
      .json({
        error: true,
        data: "We ran into an unexpected issue when ending your current session.",
      })
      .end();

  return res
    .status(200)
    .json({ error: false, data: "You have successfully ended your session." })
    .end();
});

module.exports = router;
