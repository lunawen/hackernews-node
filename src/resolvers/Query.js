async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [{ description: { contains: args.filter } }, { url: { contains: args.filter } }],
      }
    : {};

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
  });

  return links;
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
