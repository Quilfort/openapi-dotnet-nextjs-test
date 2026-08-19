using Microsoft.EntityFrameworkCore;

namespace Backend.Data.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Agenda> Agendas { get; set; }

    public virtual DbSet<AgendaItem> AgendaItems { get; set; }

    public virtual DbSet<AgendaTask> AgendaTasks { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id)
                .HasName("users_pkey");

            entity.Property(e => e.Id)
                .ValueGeneratedNever();

            entity.HasOne(e => e.Department)
                .WithMany(e => e.Users)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Agenda>(entity =>
        {
            entity.HasKey(e => e.Id)
                .HasName("agendas_pkey");
        });

        modelBuilder.Entity<AgendaItem>(entity =>
        {
            entity.HasKey(e => e.Id)
                .HasName("agenda_items_pkey");

            entity.HasOne(e => e.Agenda)
                .WithMany()
                .HasForeignKey(e => e.AgendaId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AgendaTask>(entity =>
        {
            entity.HasKey(e => e.Id)
                .HasName("agenda_tasks_pkey");

            entity.HasOne(e => e.AgendaItem)
                .WithMany(e => e.AgendaTasks)
                .HasForeignKey(e => e.AgendaItemId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Department)
                .WithMany()
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}