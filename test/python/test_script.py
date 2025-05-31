"""
Test Python script for testing the Python code extractor.
This script contains various Python constructs to test the extractor.
"""

def hello_world():
    """A simple function that prints hello world"""
    print("Hello, world!")


class TestClass:
    """A test class for demonstration"""
    
    def __init__(self, name: str):
        """Initialize the TestClass with a name.
        
        Args:
            name: The name to use for greeting
        """
        self.name = name
    
    def greet(self) -> None:
        """Greets the user with the stored name"""
        print(f"Hello, {self.name}!")


async def async_example() -> str:
    """An example async function.
    
    Returns:
        str: A greeting message
    """
    return "This is an async function"


if __name__ == "__main__":
    # Example usage
    hello_world()
    test = TestClass("Tester")
    test.greet()
