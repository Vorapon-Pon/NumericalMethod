#include <iostream>
#include <vector>
#include <iomanip> 

using namespace std;

double calculateCoefficient(const vector<pair<double, double>>& points, int i, int j) {
    if (i == j) {
        return points[i].second; // f(x_i)
    }
    return (calculateCoefficient(points, i + 1, j) - calculateCoefficient(points, i, j - 1)) /
           (points[j].first - points[i].first);
}

void calculateNewtonDividedDifference(const vector<pair<double, double>>& points, double interpolateX) {
    int n = points.size();
    vector<double> coefficients;

    for (int i = 0; i < n; i++) {
        coefficients.push_back(calculateCoefficient(points, 0, i));
    }

    double result = coefficients[0];
    double term = 1.0;
    for (int i = 1; i < n; i++) {
        term *= (interpolateX - points[i - 1].first);
        result += coefficients[i] * term;
    }

    cout << "Newton Divide Differences: " << result << endl; // 9.681924500000003
}

int main() {
    vector<pair<double, double>> points = {{0, 9.81}, {20000, 9.7487}, {40000, 9.6879}, {60000, 9.6287}, {80000, 9.5682}};
    vector<double> x = {0, 20000, 40000, 60000, 80000};
    vector<double> y = {9.81, 9.7487, 9.6879, 9.6287, 9.5682};
    double value = 42000;

    calculateNewtonDividedDifference(points, value);

    return 0;
}
