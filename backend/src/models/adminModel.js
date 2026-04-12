const prisma = require("../config/prisma");

exports.getPopular = async () => {
    return prisma.book.findMany({
        orderBy: {
            borrows: {
                _count: "desc",
            },
        },
        take: 10,
    });
};

exports.getStatsModel = async () => {
    const [totalBooks, totalUsers, activeBorrows, returnedBorrows, pendingReservations] =
        await Promise.all([
            prisma.book.count(),
            prisma.user.count(),
            prisma.borrow.count({ where: { status: "BORROWED" } }),
            prisma.borrow.count({ where: { status: "RETURNED" } }),
            prisma.reservation.count({ where: { status: "PENDING" } }),
        ]);

    return {
        totalBooks,
        totalUsers,
        borrows: {
            active: activeBorrows,
            returned: returnedBorrows,
            total: activeBorrows + returnedBorrows,
        },
        pendingReservations,
    };
};
