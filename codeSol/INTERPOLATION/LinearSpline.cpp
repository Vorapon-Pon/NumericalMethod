#include <iostream>
#include <vector>

using namespace std;

double linearSpline(const vector<pair<double, double>>& points, double x) {
    int n = points.size();

    for (int i = 0; i < n - 1; i++) {
        double x0 = points[i].first;
        double x1 = points[i + 1].first;
        double y0 = points[i].second;
        double y1 = points[i + 1].second;

        if (x >= x0 && x <= x1) {
            double slope = (y1 - y0) / (x1 - x0);
            return y0 + slope * (x - x0);
        }
    }

    return 0;
}

int main() {
    vector<pair<double, double>> points = {{2, 9.5}, {4, 8.0}, {6, 10.5}, {8, 39.5}, {10, 72.5}};

    double xValue = 4.5;


        double result = linearSpline(points, xValue);
        cout << "Interpolated value at x = " << xValue << " is: " << result << endl;
 

    return 0;
}
