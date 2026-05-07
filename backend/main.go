package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Task Model
type Task struct {
	gorm.Model
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status" gorm:"default:'pending'"` // pending, in_progress, completed
	Priority    string `json:"priority" gorm:"default:'medium'"` // low, medium, high
}

var DB *gorm.DB

func initDatabase() {
	var err error
	DB, err = gorm.Open(sqlite.Open("tasks.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database")
	}

	// Auto Migration
	DB.AutoMigrate(&Task{})
}

func setupRoutes(app *fiber.App) {
	api := app.Group("/api/v1")

	// CRUD Routes
	api.Get("/tasks", getTasks)
	api.Get("/tasks/:id", getTask)
	api.Post("/tasks", createTask)
	api.Put("/tasks/:id", updateTask)
	api.Delete("/tasks/:id", deleteTask)
}

// Handlers
func getTasks(c *fiber.Ctx) error {
	var tasks []Task
	DB.Find(&tasks)
	return c.JSON(tasks)
}

func getTask(c *fiber.Ctx) error {
	id := c.Params("id")
	var task Task
	if err := DB.First(&task, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Task not found"})
	}
	return c.JSON(task)
}

func createTask(c *fiber.Ctx) error {
	task := new(Task)
	if err := c.BodyParser(task); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	DB.Create(&task)
	return c.Status(201).JSON(task)
}

func updateTask(c *fiber.Ctx) error {
	id := c.Params("id")
	var task Task
	if err := DB.First(&task, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Task not found"})
	}

	if err := c.BodyParser(&task); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	DB.Save(&task)
	return c.JSON(task)
}

func deleteTask(c *fiber.Ctx) error {
	id := c.Params("id")
	var task Task
	if err := DB.First(&task, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Task not found"})
	}
	DB.Delete(&task)
	return c.SendStatus(204)
}

func main() {
	app := fiber.New()

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New())

	// Database
	initDatabase()

	// Routes
	setupRoutes(app)

	log.Fatal(app.Listen(":8080"))
}
