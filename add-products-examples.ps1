# PowerShell Script Examples for Adding Products
# Make sure your backend is running on http://localhost:3002

$baseUrl = "http://localhost:3002"

Write-Host "=== Product Data Explorer - API Examples ===" -ForegroundColor Cyan
Write-Host ""

# Example 1: Scrape Navigation Headings
Write-Host "1. Scraping Navigation Headings..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/scraping/navigation" -Method POST -UseBasicParsing
    Write-Host "   Success! Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Example 2: Scrape Categories
Write-Host "2. Scraping Categories..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/scraping/categories" -Method POST -UseBasicParsing
    Write-Host "   Success! Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Example 3: Scrape Products (Limited to 10 for testing)
Write-Host "3. Scraping Products (limit: 10)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/scraping/products?limit=10" -Method POST -UseBasicParsing
    Write-Host "   Success! Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Example 4: Manually Create a Product
Write-Host "4. Manually Creating a Product..." -ForegroundColor Yellow
$productData = @{
    title = "Example Book Title"
    author = "John Doe"
    price = "£12.99"
    originalPrice = "£15.99"
    productUrl = "https://www.worldofbooks.com/en-gb/books/example-book/123456789"
    sourceId = "123456789"
    isbn = "1234567890123"
    publisher = "Example Publisher"
    description = "This is an example book description."
    rating = 4.5
    reviewCount = 25
    isAvailable = $true
    tags = @("fiction", "example")
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method POST -Body $productData -ContentType "application/json" -UseBasicParsing
    Write-Host "   Success! Product created: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""

# Example 5: Get All Products
Write-Host "5. Fetching Products..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products?page=1&limit=10" -UseBasicParsing
    $products = $response.Content | ConvertFrom-Json
    Write-Host "   Found $($products.total) products" -ForegroundColor Green
    Write-Host "   Showing $($products.products.Count) products on this page" -ForegroundColor Green
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan

