#include <iostream>
#include <iomanip>
#include <cmath>
//Secant Method;
using namespace std;

double func(double x);
double error(double x0, double x1);

int main() {
    double x0 = 2;
    double x1 = 3;
    double x2;

    double f0,f1;
    double tolerance = 0.000001;
    double err = 1; 

    while(err > tolerance) {
        f0 = func(x0);
        f1 = func(x1);

        x2 = x1 - ((f1 * (x0 - x1)) / (f0 - f1));
        err = error(x0, x1);

        x0 = x1;
        x1 = x2;

        cout << "x new " << fixed << setprecision(10) << x2 << endl;
        cout << "error " << fixed << setprecision(10) << err << endl << endl;
    }

    cout << "root is " << fixed << setprecision(6) << x2 << endl;

    return 0;
}

double func(double x) {
    return exp(x) - 8;
}

double error(double x0, double x1) {
    return fabs((x1 - x0) / x1);
}