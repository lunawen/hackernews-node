const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../utils");

async function signup(parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10);

  // 2
  const user = await context.prisma.user.create({ data: { ...args, password } });

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4
  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  // 1
  const user = await context.prisma.user.findUnique({ where: { email: args.email } });
  if (!user) {
    throw new Error("No such user found");
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3
  return {
    token,
    user,
  };
}

async function post(parent, args, context, info) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubSub.publish("NEW_LINK", newLink);
  return newLink;
}

async function updateLink(_, { id, url, description }, context) {
  let toUpdate = await context.prisma.link.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  let newUrl = url == null ? toUpdate.url : url;
  let newDescription = description == null ? toUpdate.description : description;

  let updated = await context.prisma.link.update({
    where: {
      id: parseInt(id),
    },
    data: {
      url: newUrl,
      description: newDescription,
    },
  });

  return updated;
}
async function deleteLink(_, { id }, context) {
  let toDelete = await context.prisma.link.delete({
    where: {
      id: parseInt(id),
    },
  });

  if (toDelete.length != 0) {
    links = links.filter((l) => l.id != id);
    return true;
  }
  return false;
}

module.exports = {
  signup,
  login,
  post,
  updateLink,
  deleteLink,
};
