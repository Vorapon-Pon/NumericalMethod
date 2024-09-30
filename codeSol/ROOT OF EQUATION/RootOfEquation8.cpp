#include <iostream>
#include <iomanip>
#include <cmath>

using namespace std;
//Newton Raphson;
double F(double x);
double f(double x);
double error(double x, double xi);

int main() {
    double x = 2;
    double xi = 0;
    double err = 1;
    double tolerance = 0.000001;

    while(err > tolerance) {
        xi = x - (F(x) / f(x));
        err = error(x , xi);

        x = xi;
        cout << fixed << setprecision(10) << xi << endl;
        cout << fixed << setprecision(10) << err << endl;
    }

    cout << "root is " << fixed << setprecision(6) << x << endl;

    return 0;
}

double F(double x) {
    return exp(x) - 8;
}

double f(double x) {
    return exp(x);
}

double error(double x, double xi) {
    return fabs((xi - x) / xi);
}