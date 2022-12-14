const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

module.exports = async function (req, res, next) {
  if (!req.headers.authorization)
    return res
      .status(403)
      .json({
        error: true,
        data: "You must ensure you're providing the access token in the 'Authorization' header.",
      })
      .end();

  const { authorization } = req.headers;

  // This isn't technically true OAuth2, but by doing this we can keep our data schemes in a way that will allow us to easily switch to true OAuth2
  const accessToken = authorization.replace("Bearer ", "").trim();

  if (
    (await prisma.session.count({ where: { accessToken, status: true } })) <= 0
  )
    return res
      .status(403)
      .json({
        error: true,
        data: "You provided a access token that does not exist.",
      })
      .end();

  const session = await prisma.session.findFirst({
    where: { accessToken, status: true },
  });
  const member = await prisma.member.findFirst({
    where: { id: session.memberId, status: true },
    include: {
      roles: true,
      sessions: true,
    },
  });

  const verified = jwt.verify(session.accessToken, member.password);

  if (!verified)
    return res
      .status(403)
      .json({
        error: true,
        data: "The token you provided is not a valid token.",
      })
      .end();

  req.session = session;
  req.member = member;

  next();
};
