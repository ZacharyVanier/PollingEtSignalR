using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using labo.signalr.api.Data;
using labo.signalr.api.Models;

namespace labo.signalr.api.Hubs;

public class UselessTasksHub : Hub
{
    private readonly ApplicationDbContext _context;
    private static int _userCount = 0;

    public UselessTasksHub(ApplicationDbContext context)
    {
        _context = context;
    }

    public override async Task OnConnectedAsync()
    {
        _userCount++;
        var tasks = await _context.UselessTasks.ToListAsync();
        await Clients.Caller.SendAsync("TaskList", tasks);
        await Clients.All.SendAsync("UserCount", _userCount);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _userCount--;
        await Clients.All.SendAsync("UserCount", _userCount);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task AddTask(string taskText)
    {
        var task = new UselessTask
        {
            Text = taskText,
            Completed = false
        };
        _context.UselessTasks.Add(task);
        await _context.SaveChangesAsync();

        var tasks = await _context.UselessTasks.ToListAsync();
        await Clients.All.SendAsync("TaskList", tasks);
    }

    public async Task CompleteTask(int id)
    {
        var task = await _context.FindAsync<UselessTask>(id);
        if (task != null)
        {
            task.Completed = true;
            await _context.SaveChangesAsync();
        }

        var tasks = await _context.UselessTasks.ToListAsync();
        await Clients.All.SendAsync("TaskList", tasks);
    }
}
