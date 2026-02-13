using System;
namespace labo.signalr.api.Models
{
	public class UselessTask
	{
		public UselessTask()
		{
		}

		public int Id { get; set; }
		public string Text { get; set; } = "";
		public bool Completed { get; set; } = false;
	}
}