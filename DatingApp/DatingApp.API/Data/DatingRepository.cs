using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data;

public class DatingRepository : IDatingRepository
{
    private readonly DataContext _context;

    public DatingRepository(DataContext context)
    {
        _context = context;
    }

    public void Add<T>(T entity) where T : class
    {
        _context.Add(entity);
    }

    public void Delete<T>(T entity) where T : class
    {
        _context.Remove(entity);
    }

    public async Task<Like> GetLike(int userId, int recipientId)
    {
        return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId &&
            u.LikeeId == recipientId);
    }

    public async Task<Photo> GetMainPhotoForUser(int userId)
    {
        return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
    }

    public async Task<Photo> GetPhoto(int id)
    {
        var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

        return photo;
    }

    public async Task<User> GetUser(int id)
    {
        var user = await _context.Users.Include(p => p.Photos)
                                            .FirstOrDefaultAsync(u => u.Id == id);
        return user;
    }

    public async Task<PagedList<User>> GetUsers(UserParams userParams)
    {
        var users = _context.Users
            .Include(p => p.Photos)
            .OrderByDescending(u => u.LastActive)
            .AsQueryable();

        users = users.Where(u => u.Id != userParams.UserId);
        users = users.Where(u => u.Gender == userParams.Gender);

        if (userParams.Likers)
        {
            var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
            users = users.Where(u => userLikers.Any(liker => liker.LikerId == u.Id));
        }

        if (userParams.Likees)
        {
            var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
            users = users.Where(u => userLikees.Any(likee => likee.LikeeId == u.Id));
        }

        if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            users = users.Where(u => u.DateOfBirth.CalculateAge() >= userParams.MinAge
                && u.DateOfBirth.CalculateAge() <= userParams.MaxAge);

        if (!string.IsNullOrEmpty(userParams.OrderBy))
        {
            switch (userParams.OrderBy)
            {
                case "created":
                    users = users.OrderByDescending(u => u.Created);
                    break;
                default:
                    users = users.OrderByDescending(u => u.LastActive);
                    break;
            }
        }

        return await PagedList<User>
                    .CreateAsync(users, userParams.PageNumber, userParams.PageSize);
    }

    private async Task<IEnumerable<Like>> GetUserLikes(int id, bool likers)
    {
        var user = await _context.Users
            .Include(x => x.Likee)
            .Include(x => x.Liker)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (likers)
        {
            return user.Likee.Where(u => u.LikeeId == id);
        }
        else
        {
            return user.Liker.Where(u => u.LikerId == id);
        }
    }

    public async Task<bool> SaveAll()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}