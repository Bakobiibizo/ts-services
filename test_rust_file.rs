// This is a test Rust file with various items

/// A simple function that adds two numbers
fn add(a: i32, b: i32) -> i32 {
    a + b
}

/// A simple struct representing a point in 2D space
struct Point {
    x: f64,
    y: f64,
}

/// Implementation block for Point
impl Point {
    /// Creates a new Point
    fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }
    
    /// Calculates the distance from origin
    fn distance_from_origin(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

/// A simple trait for shapes
trait Shape {
    /// Calculates the area of the shape
    fn area(&self) -> f64;
    
    /// Calculates the perimeter of the shape
    fn perimeter(&self) -> f64;
}

/// An enum representing different shapes
enum ShapeType {
    Circle(f64),
    Rectangle(f64, f64),
    Square(f64),
}

/// Implementation of Shape for ShapeType
impl Shape for ShapeType {
    fn area(&self) -> f64 {
        match self {
            ShapeType::Circle(radius) => std::f64::consts::PI * radius * radius,
            ShapeType::Rectangle(width, height) => width * height,
            ShapeType::Square(side) => side * side,
        }
    }
    
    fn perimeter(&self) -> f64 {
        match self {
            ShapeType::Circle(radius) => 2.0 * std::f64::consts::PI * radius,
            ShapeType::Rectangle(width, height) => 2.0 * (width + height),
            ShapeType::Square(side) => 4.0 * side,
        }
    }
}
