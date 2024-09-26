const { Op } = require('sequelize');

class BookmarkService {
	constructor(db) {
		this.client = db.sequelize;
		this.Bookmarks = db.Bookmarks;
	}

	async create(Name, URL, UserId) {
		return this.Bookmarks.create({
			Name: Name,
			url: URL,
			UserId: UserId,
		});
	}

	async getUsersBookmarks(userId) {
		return await this.Bookmarks.findAll({
			where: { UserId: userId },
		});
	}

	async getUserBookmarkById(bookmarkId, userId) {
		return await this.Bookmarks.findOne({ where: { id: bookmarkId, UserId: userId } })
	}

	async updateUserBookmark(bookmarkId, userId, categoryName) {
		return await this.Bookmarks.update({ Name: categoryName }, { where: { UserId: userId, id: bookmarkId } })
	}
}
module.exports = BookmarkService;

