#include <iostream>
#include <vector>
using namespace std;

double lagrangeInterpolate(const vector<double>& x, const vector<double>& y, double value) {
    double result = 0;
    int n = x.size();

    for (int i = 0; i < n; i++) {
        double term = y[i];
        for (int j = 0; j < n; j++) {
            if (i != j) {
                term *= (value - x[j]) / (x[i] - x[j]);
            }
        }
        result += term;
    }

    return result;
}

int main() {
    vector<double> x = {0, 20000, 40000, 60000, 80000};
    vector<double> y = {9.81, 9.7487, 9.6879, 9.6287, 9.5682};
    double value = 42000;

    double result = lagrangeInterpolate(x, y, value); // 9.681924500000003
    cout << "Lagrange Interpolation: " << result << endl;

    return 0;
}
