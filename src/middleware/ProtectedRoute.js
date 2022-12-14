const { PrismaClient } = require("@prisma/client");
const responseBuilder = require("../utilities/responseBuilder");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

module.exports = async function (req, res, next) {
  if (!req.headers.authorization)
    return responseBuilder(
      res,
      403,
      "You must ensure you're providing the access token in the 'Authorization' header."
    );

  const { authorization: authHeader } = req.headers;

  // This isn't technically true OAuth2, but by doing this we can keep our data schemes in a way that will allow us to easily switch to true OAuth2
  const accessToken = authHeader.replace("Bearer ", "").trim();

  const session = await prisma.session.findFirst({
    where: { accessToken, status: true },
  });

  if (!session)
    return responseBuilder(
      res,
      403,
      true,
      "You provided a access token that does not exist."
    );

  if (!session.status)
    return responseBuilder(
      res,
      403,
      true,
      "The session you provided has been terminated."
    );

  const member = await prisma.member.findFirst({
    where: { id: session.memberId },
    include: {
      roles: true,
      sessions: true,
    },
  });

  const verified = jwt.verify(session.accessToken, member.password);

  if (!verified)
    return responseBuilder(
      res,
      403,
      true,
      "The token you provided is not a valid token."
    );

  req.session = session;
  req.member = member;

  next();
};
