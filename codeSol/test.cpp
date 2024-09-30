#include <iostream>
#include <iomanip>
#include <cmath>

using namespace std;

double error(double x_new , double x_old) {
    return fabs((x_new - x_old) / x_new) ;
}

int main() {

    double x2 = 0.724;
    double x1 = 0.6704;

    cout << error(x2,x1);

    return 0;
}
