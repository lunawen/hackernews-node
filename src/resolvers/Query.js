function feed(_, __, context) {
  return context.prisma.link.findMany();
}

module.exports = {
  feed,
};
