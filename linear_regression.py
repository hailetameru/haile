# LINEAR REGRESSION (Manual - No libraries)

n = int(input("Enter number of data points: "))

x = []
y = []

print("\nEnter data points:")
for i in range(n):
    xi = float(input(f"x[{i+1}]: "))
    yi = float(input(f"y[{i+1}]: "))
    x.append(xi)
    y.append(yi)

# mean values
x_mean = sum(x) / n
y_mean = sum(y) / n

# slope (m) and intercept (b)
numerator = 0
denominator = 0

for i in range(n):
    numerator += (x[i] - x_mean) * (y[i] - y_mean)
    denominator += (x[i] - x_mean) ** 2

m = numerator / denominator
b = y_mean - (m * x_mean)


print("\n--- MODEL RESULT ---")
print(f"Equation: y = {m}x + {b}")

# prediction
x_new = float(input("\nEnter x value to predict y: "))
y_pred = m * x_new + b

print("Predicted y:", y_pred)