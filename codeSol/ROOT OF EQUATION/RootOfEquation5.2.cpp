#include <iostream>
#include <cmath>
#include <iomanip>

using namespace std;

double falsePosition(double xl, double xr);
double notRound(double result, int precision) ;
double function(double x);

int main() {
    double xl = 1.5;
    double xr = 2.0;
    int precision = 6;

    double root = falsePosition(xl, xr);
    double result = notRound(root, precision);
    cout << "root is " << fixed << setprecision(precision) << result << endl;

    return 0;
}

double falsePosition(double xl, double xr) {
    double xm;
    double tolerance = 0.0000001;

    while(fabs(function(xm)) >= tolerance) {
        cout << "xl : " << xl << " xr : " << xr <<endl;
        xm = (xl * function(xr) - xr * function(xl)) / (function(xr) - function(xl));
        cout << "xm : " << xm <<endl;
        cout << "f(xm) : " << fixed << setprecision(12) << function(xm) <<endl;
        cout << "f(xr) : " << fixed << setprecision(12) << function(xr) <<endl<<endl;
        if (fabs(function(xm)) < tolerance) {
            break;
        } else if (function(xm) * function(xr) < 0) {
            xl = xm;
        } else {
            xr = xm;
        }
    }

    return xm;
}

double function(double x) {
    return pow(x,4) - 13;
}

double notRound(double result, int precision) {
    double scale = pow(10.0, precision);
    return floor(result * scale) / scale;
}
