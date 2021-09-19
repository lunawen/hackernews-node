function feed(_, __, context) {
  return context.prisma.link.findMany();
}

function link(_, args, context) {
  return context.prisma.link.findFirst({
    where: {
      id: parseInt(args.id),
    },
  });
}

function info() {
  return `This is the API of a Hackernews Clone`;
}
module.exports = {
  feed,
  link,
  info,
};
