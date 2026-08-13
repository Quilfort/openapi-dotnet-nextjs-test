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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<Agenda>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("agendas_pkey");
        });

        modelBuilder.Entity<AgendaItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("agenda_items_pkey");

            entity.HasOne(e => e.Agenda)
                .WithMany()
                .HasForeignKey(e => e.AgendaId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}